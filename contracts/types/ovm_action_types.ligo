type deposit_params is record
  token_type: token_type;
  token_type_string: string;
  amount: nat;
  amount_string: string;
end

type submit_params is record
  block_number: nat;
  block_number_string: string;
  root: string;
end

type finalize_checkpoint_params is record
  hoge: nat;
end

type start_exit_params is record
  hoge: nat;
end

type finalize_exit_params is record
  hoge: nat;
end

type action is
  | Deposit of deposit_params
  | Submit of submit_params
  | FinalizeCheckpoint of finalize_checkpoint_params
  | StartExit of start_exit_params
  | FinalizeExit of finalize_exit_params
  | GetStorage of int
