load('./tilt-lib/config.star', 'get_settings')
settings = get_settings()
namespace = 'default'
mainChart_deps = []

docker_registries = settings.get('dockerRegistries')
armdocker = docker_registries['armdocker']
serodocker = docker_registries['serodocker']

# this variable is used both in Chassis and CI block
ingressHost = settings.get('ingressHost', 'localhost')
image_base_os_version = '4.0.0-41'

# Handle remote mode
load('./tilt-lib/init-namespace.star', 'init_namespace', 'docker_login', 'generate_namespace_name')
if settings.get('mode') == 'remote':
  allow_k8s_contexts(settings.get('kubecontext'))
  local('node scripts/generate-npm-tokens.js')
  namespace = generate_namespace_name()
  init_namespace(namespace)
  #local('kubectl config set-context --current --namespace=' + namespace)
  docker_login()

if settings.get('deployMainService'):
  # ---------- ADP NodeJS Microservice Chassis -------------
  docker_build(
    armdocker['url'] + '/' + armdocker['path'] + '/chassis', # image name
    '.', # base path for docker build
    dockerfile='./docker/Dockerfile',
    entrypoint='./entrypoint.sh -d',
    build_args={'DEV': 'true', 'BASE_OS_VERSION': image_base_os_version},
    secret=[
      'id=arm_npm_token,src=.bob/var.token',
      'id=rnd_arm_npm_token,src=.bob/var.rnd-token'
    ],
    live_update=[
      fall_back_on(['backend/package.json']),
      sync('backend', '/nodejs-service/server'),
      # run('cd /nodejs-service/server && npm install', trigger=['backend/package.json']),
    ]
  )

  set_params = [ # Values to set from the command-line
    'imageCredentials.main.registry.url=' + armdocker['url'],
    'imageCredentials.pullSecret=' + armdocker['secretName'],
    'imageCredentials.main.repoPath=' + armdocker['path'],
    'imageCredentials.main.name=chassis',
    'ingress.enabled='+str(settings.get('ingressEnabled')),
    'ingress.path='+settings.get('ingressPath', '/chassis' + os.environ['USER']),
    'ingress.hostname='+ingressHost,
    'ingress.tls.enabled='+str(settings.get('ingressEnableTLS')),
    'ingress.useContour='+str(settings.get('ingressUseContour')),
    'ingress.ingressClass='+settings.get('ingressClass'),
    'ingress.adpIccrServiceName='+str(settings.get('adpIccrServiceName')),
    'global.security.tls.enabled='+str(settings.get('mTLS')),
    'service.endpoints.http.tls.verifyClientCertificate='+settings.get('verifyClientCertificate', 'optional'),
    'configuration.logging.syslog.enabled='+str(settings.get('syslogEnabled')),
    'configuration.faultIndications.enabled='+str(settings.get('faultIndicationsEnabled')),
    'configuration.logging.defaultLogLevel='+settings.get('logLevel', 'info'),
    'metrics.enabled='+str(settings.get('deployPm')),
    'replicaCount='+str(settings.get('replicaCount', 1)) # live reload only works with single pod
  ]

  # reusing Ingress host when setting up APO FQDN's
  if settings.get('authzProxy'):
    authFqdn = ''.join(['authn.iam.', ingressHost])
    keycloakFqdn = ''.join(['iam.', ingressHost])
    set_params.append('authorizationProxy.enabled='+str(settings.get('authzProxy')))
    set_params.append('authorizationProxy.authnProxyFQDN='+authFqdn)
    set_params.append('authorizationProxy.keycloakFQDN='+keycloakFqdn)
    set_params.append('authorizationProxy.adpIccrServiceName='+str(settings.get('adpIccrServiceName')))

  chassis_yaml = helm(
    'charts/eric-adp-nodejs-chassis-service/',
    name='nodejs-chassis-service', # The release name, equivalent to helm --name
    namespace=namespace, # The namespace to install in, equivalent to helm --namespace
    set=set_params
  )
  # live reload needs write access to the root fs
  chassis_yaml = blob(str(chassis_yaml).replace('readOnlyRootFilesystem: true','readOnlyRootFilesystem: false'))
  k8s_yaml(chassis_yaml)

if not settings.get('isCiChartDeployed') and settings.get('mode') == 'remote':
  logNeeded = settings.get('deployLogTransformer')
  fmNeeded = settings.get('deployFm')
  iamNeeded = settings.get('deployIam')
  pmNeeded = settings.get('deployPm') or fmNeeded or iamNeeded
  iccrNeeded = settings.get('deployIccr')

  ci_params = [ # Values to set from the command-line
      'global.pullSecret='+armdocker['secretName'],
      'global.security.tls.enabled='+str(settings.get('mTLS')),
      'eric-sec-sip-tls.enabled=true',
      'eric-log-transformer.enabled='+str(logNeeded),
      'eric-pm-server.enabled='+str(pmNeeded),
      'eric-data-document-database-fault-handling.enabled='+str(fmNeeded),
      'eric-fh-alarm-handler.enabled='+str(fmNeeded),
      'eric-fh-alarm-handler.imageCredentials.pullSecret='+serodocker['secretName'],
      'eric-eea-ingress-ctrl-applications.enabled='+str(iccrNeeded),
      'eric-lm-combined-server.enabled='+str(settings.get('logLicenses')),
      'eric-lm-combined-server-db.enabled='+str(settings.get('logLicenses'))
  ]

  if iamNeeded:
    iamAuthFqdn = ''.join(['authn.iam.', ingressHost])
    iamKeycloakFqdn = ''.join(['iam.', ingressHost])
    ci_params.append('eric-sec-access-mgmt.enabled=true')
    ci_params.append('eric-data-document-database-iam.enabled=true')
    ci_params.append('eric-sec-access-mgmt.authenticationProxy.ingress.hostname='+iamAuthFqdn)
    ci_params.append('eric-sec-access-mgmt.ingress.hostname='+iamKeycloakFqdn)

  ci_yaml = helm(
    './charts/ci',
    name='ci', # The release name, equivalent to helm --name
    namespace=namespace, # The namespace to install in, equivalent to helm --namespace
    set=ci_params
  )
  k8s_yaml(ci_yaml, allow_duplicates=True)

  # in case there is Contour, wait for it and save its loadbalancer IP
  if iccrNeeded:
    cmd = 'kubectl -n ${NAMESPACE} get service -o=jsonpath=\'{.items[?(@.spec.type == "LoadBalancer")].status.loadBalancer.ingress[0].ip}\' \
      > tilt.iccr.ip.txt && \
      echo "ICCR address in ${NAMESPACE} namespace:" && cat tilt.iccr.ip.txt && echo "\\n"'
    local_resource(
      'tilt-iccr-ip-fetcher',
      cmd,
      resource_deps=['eric-eea-ingress-ctrl-applications-contour'],
      env = {'NAMESPACE':namespace}
    )

  # Configuring resources dependencies to maintain the deploy order of CI services for chassis
  chassisDeps = []
  mtlsDeps = []
  if settings.get('mTLS'):
    mtlsDeps = ['eric-sec-sip-tls-main', 'eric-sec-key-management-main', 'eric-data-distributed-coordinator-ed']

  # faultHandling service dependeicies
  if fmNeeded:
    fHServiceDeps = []
    zkDeps = []
    kFDeps = []
    dbFHDeps = []

    fHServiceDeps.append('eric-data-message-bus-kf')
    kFDeps.extend(['eric-data-document-database-fault-handling','eric-data-coordinator-zk'])
    dbFHDeps.extend(mtlsDeps)
    zkDeps.extend(mtlsDeps)

    if settings.get('deployPm'):
      dbFHDeps.append('eric-pm-server')

    chassisDeps.append('eric-fh-alarm-handler')
    k8s_resource('eric-data-message-bus-kf', resource_deps=kFDeps)
    k8s_resource('eric-data-document-database-fault-handling', resource_deps=dbFHDeps)
    k8s_resource('eric-data-coordinator-zk', resource_deps=zkDeps)
    k8s_resource('eric-fh-alarm-handler',
      port_forwards=[
        '5005:5005',   # rest-api for alarms
      ],
      resource_deps=fHServiceDeps)

  # PM service dependeicies
  if pmNeeded:
    pMServiceDeps = []
    pMServiceDeps.extend(mtlsDeps)

    chassisDeps.append('eric-pm-server')
    k8s_resource('eric-pm-server', resource_deps=pMServiceDeps)

  # LM service dependencies
  if settings.get('logLicenses'):
    lmServiceDep = ['eric-lm-combined-server-license-consumer-handler', 'eric-lm-combined-server-license-server-client', 'eric-lm-combined-server-db']
    chassisDeps.extend(lmServiceDep)
    k8s_resource('eric-lm-combined-server-license-consumer-handler',
      resource_deps=mtlsDeps)
    k8s_resource('eric-lm-combined-server-db', resource_deps=mtlsDeps)

  if settings.get('deployMainService'):
    k8s_resource('eric-adp-nodejs-chassis-service', port_forwards=['3001:3000', '9230:9229'], resource_deps=chassisDeps )
else:
    k8s_resource('eric-adp-nodejs-chassis-service', # deployment name in the k8s yaml
    port_forwards=[
      '3001:3000',
      '9230:9229',   # debugger
    ]
  )

