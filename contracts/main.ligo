#include "types/index.ligo"
#include "actions/index.ligo"

function main (const action: action; const s: ovm_storage) : context is
  block {skip} with
  case action of
    | Deposit(deposit_params) -> deposit_action(deposit_params, s)
    | Submit(submit_params) -> submit_action(submit_params, s)
  end

(**
 * get plasma current block number
 *)
function get_current_block (const params: int; const s: ovm_storage) : (list(operation) * int) is
  block {skip} with ((nil : list(operation)),
    s.current_block
  )

(**
 * get plasma block
 * @param block_number is int
 *)
function get_block (const block_number: int; const s: ovm_storage) : (list(operation) * string) is
  block {skip} with ((nil : list(operation)),
    get_force(block_number, s.commitments)
  )
