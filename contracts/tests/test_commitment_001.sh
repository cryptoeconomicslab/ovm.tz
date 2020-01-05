#!/bin/sh
SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)
ligo dry-run contracts/main.ligo main "`echo $(cat ${SCRIPT_DIR}/params/param_commitment_001)`" "`echo $(cat ${SCRIPT_DIR}/storages/initial_storage)`" --amount=1 --source=tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV
