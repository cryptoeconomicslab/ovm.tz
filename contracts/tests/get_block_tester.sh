#!/bin/sh
ligo dry-run main.ligo get_block "`echo $(cat get_block_parameter)`" "`echo $(cat initial_storage)`" --amount=1
