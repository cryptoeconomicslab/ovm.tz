#!/bin/sh
ligo dry-run main.ligo get_current_block "`echo $(cat get_current_block_parameter)`" "`echo $(cat initial_storage)`" --amount=1
