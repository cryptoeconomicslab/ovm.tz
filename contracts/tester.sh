# ligo compile-storage main.ligo main "`echo $(cat initial_storage)`"

ligo dry-run main.ligo main "`echo $(cat initial_parameter)`" "`echo $(cat initial_storage)`" --amount=1
