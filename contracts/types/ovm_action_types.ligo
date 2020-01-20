
#include "ovm_primitive_types.ligo"

type token_type is address

// deposit contract
type deposit_params is record
  token_type: token_type;
  amount: nat;
  state_object: property;
end

type finalize_checkpoint_params is record
  token_type: token_type;
  checkpoint_property: property;
end

type finalize_exit_params is record
  token_type: token_type;
  exit_property: property;
  deposited_range_id: nat;
end

// commitment contract
type submit_params is record
  block_number: nat;
  root: string;
end

// adjudication contract
type claim_property_params is record
  claim: property;
end

type action is
  | Deposit of deposit_params
  | FinalizeCheckpoint of finalize_checkpoint_params
//  | FinalizeExit of finalize_exit_params
  | Submit of submit_params
//  | ClaimProperty of claim_property_params
