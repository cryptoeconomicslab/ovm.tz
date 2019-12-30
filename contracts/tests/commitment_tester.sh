#!/bin/sh
SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)
ligo dry-run contracts/main.ligo main "`echo $(cat ${SCRIPT_DIR}/commitment_parameter)`" "`echo $(cat ${SCRIPT_DIR}/initial_storage)`" --amount=1
