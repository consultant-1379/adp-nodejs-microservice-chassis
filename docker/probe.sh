#! /bin/bash -e
# Copyright (c) Ericsson AB 2022  All rights reserved.
#
# The information in this document is the property of Ericsson.
#
# Except as specifically authorized in writing by Ericsson, the
# receiver of this document shall keep the information contained
# herein confidential and shall protect the same in whole or in
# part from disclosure and dissemination to third parties.
#
# Disclosure and disseminations to the receivers employees shall
# only be made on a strict need to know basis.

res="$(curl -o /dev/null -sS -w %{http_code} https://localhost:3000/status --cert /nodejs-service/server/certificates/httpClient/cert.pem --key /nodejs-service/server/certificates/httpClient/key.pem -k)"
if [ "$res" != "200" ]; then
    retval=1
fi
exit $retval