#include "types/index.ligo"
#include "actions/index.ligo"

function main (const action: action; const s: ovm_storage) : context is
  block {skip} with
  case action of
    | Deposit(deposit_params) -> deposit_action(deposit_params, s)
    | Submit(submit_params) -> submit_action(submit_params, s)
  end
