#!/bin/sh
SCRIPT_DIR=$(cd $(dirname ${0}) && pwd)
ligo dry-run main.ligo get_block "`echo $(cat ${SCRIPT_DIR}/get_block_parameter)`" "`echo $(cat ${SCRIPT_DIR}/initial_storage)`" --amount=1
