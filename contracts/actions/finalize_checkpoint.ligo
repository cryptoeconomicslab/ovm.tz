#include "../models/emit_event.ligo"

function finalize_checkpoint_action (const s: ovm_storage; const finalize_checkpoint_params: finalize_checkpoint_params) : context is
begin
  skip;
  // test
  //https://github.com/cryptoeconomicslab/ovm-contracts/blob/b790c254fce3ab2b0186717b346cfd5ce640e699/test/DepositContract.test.ts#L127-L132
  
  // impl
  //https://github.com/cryptoeconomicslab/ovm-contracts/blob/master/contracts/DepositContract.sol#L153
end with ((nil : list(operation)), s)
