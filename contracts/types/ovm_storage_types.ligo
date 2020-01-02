type storage_branch is record
  total_deposited: nat;
  deposited_ranges: map(nat, range);
  checkpoints: checkpoints;
  claims: claims;
end

type ovm_storage is record
  branches: map(token_type, storage_branch);
  current_block: nat;
  commitments: commitments;
  events: events;
  operator_address: address;
end
