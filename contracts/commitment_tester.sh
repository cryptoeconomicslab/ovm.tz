#!/bin/sh
ligo dry-run main.ligo main "`echo $(cat commitment_parameter)`" "`echo $(cat initial_storage)`" --amount=1
