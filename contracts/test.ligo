#include "types/index.ligo"
#include "actions/finalize_exit.ligo"
#include "models/verify_inclusion.ligo"

(* entry point for test *)
function test_remove_deposited_range(
  const params: (range * nat);
  const s: deposit_storage
) : ( ops * deposit_storage ) is
begin skip end with ( (nil:ops) , remove_deposited_range( s, params.0, params.1))

function test_verify_inclusion(
  const params: (bytes * address * range * inclusion_proof * bytes);
  const s: bool
) : ( ops * bool ) is
begin skip end with ( (nil:ops) , verify_inclusion( params.0, params.1, params.2, params.3, params.4))
