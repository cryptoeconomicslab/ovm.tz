type token_type is address

type deposit_params is record
  token_type: token_type;
  amount: nat;
end

type submit_params is record
  block_number: int;
  root: string;
end

type action is
  | Deposit of deposit_params
  | Submit of submit_params
