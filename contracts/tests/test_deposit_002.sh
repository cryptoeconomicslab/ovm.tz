#!/bin/sh
SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)

# Deposit 1tez and confirm it
# Diff module will take the diff of deposit
# But merkle interval tree isn't implemented in this contract
ligo dry-run contracts/main.ligo main "`echo $(cat ${SCRIPT_DIR}/params/param_deposit_001)`" "`echo $(cat ${SCRIPT_DIR}/storages/initial_storage)`" --amount=1
