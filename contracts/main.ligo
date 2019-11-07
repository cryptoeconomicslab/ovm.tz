#include "types/index.ligo"
#include "actions/deposit.ligo"

function main (const action: action; const s: ovm_storage) : context is
block {
  const res: context
    = case action of
    | Deposit(deposit_params) -> deposit_action(deposit_params, s)
    end
} with res
