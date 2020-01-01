function extend_deposited_ranges (const s: ovm_storage; const deposit_params: deposit_params; const deposited_range: range; const new_end: nat) : ovm_storage is
begin 
  const storage_branch : storage_branch = get_force(deposit_params.token_type, s.branches);

  //TODO: Validations
  // https://github.com/cryptoeconomicslab/ovm-contracts/blob/master/contracts/DepositContract.sol#L96-L103

  // update all states
  storage_branch.total_deposited := storage_branch.total_deposited + deposit_params.amount;

  //TODO: what is the key?
  storage_branch.deposited_ranges[new_end] := deposited_range;

  s.branches[deposit_params.token_type] := storage_branch;
end with s;