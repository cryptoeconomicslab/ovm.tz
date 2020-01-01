#include "types/index.ligo"
#include "actions/index.ligo"

function main (const action: action; const s: ovm_storage) : context is
  block {skip} with
  case action of
    | Deposit(deposit_params) -> deposit_action(s, deposit_params)
    | Submit(submit_params) -> submit_action(s, submit_params)
    | GetStorage(params) -> get_storage_action(s, params)
  end
