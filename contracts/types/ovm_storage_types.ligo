type storage_branch is record
  total_deposited: nat;
  deposited_ranges: map(nat, range);
  checkpoints: checkpoints;
end

type events_storage is record
  ts: timestamp;
  events: topic_sorted_events;
end

type ovm_storage is record
  branches: map(token_type, storage_branch);
  current_block: nat;
  commitments: commitments;
  events_storage: events_storage;
  operator_address: address;
end
