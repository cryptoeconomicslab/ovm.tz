#include "types/index.ligo"
#include "actions/finalize_exit.ligo"

(* entry point for test *)
function test_remove_deposited_range(
  const params: (range * nat);
  const s: storage_branch
) : ( ops * storage_branch ) is
begin skip end with ( (nil:ops) , remove_deposited_range( s, params.0, params.1))
