
#include "ovm_primitive_types.ligo"

type token_type is address

// deposit contract
type deposit_params is record
  token_type: token_type;
  amount: nat;
  state_object: property;
end

type finalize_checkpoint_params is record
  token_type: bytes;
  amount: nat;
end

type finalize_exit_params is record
  token_type: bytes;
  amount: nat;
end

// commitment contract
type submit_params is record
  block_number: nat;
  root: string;
end

type action is
  | Deposit of deposit_params
  | Submit of submit_params
