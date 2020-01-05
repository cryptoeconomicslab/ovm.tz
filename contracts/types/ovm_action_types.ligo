type token_type is address

type deposit_params is record
  token_type: token_type;
  token_type_string: string;
  amount: nat;
  amount_string: string;
end

// Michelson can't cast int to string
type submit_params is record
  block_number: nat;
  block_number_string: string;
  root: string;
end

type action is
  | Deposit of deposit_params
  | Submit of submit_params
  | GetStorage of int
