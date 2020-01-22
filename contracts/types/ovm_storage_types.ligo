type storage_branch is record
  total_deposited: nat;
  deposited_ranges: map(nat, range);
  checkpoints: checkpoints;
end

type events_storage is record
  ts: timestamp;
  events: topic_sorted_events;
end

type commitment_storage is record
  current_block: nat;
  commitments: commitments;
  operator_address: address;
end

type adjudication_storage is record
  instantiated_games: map(bytes, challenge_game);
end

type ovm_storage is record
  branches: map(token_type, storage_branch);
  commitment_storage: commitment_storage;
  adjudication_storage: adjudication_storage;
  events_storage: events_storage;
end
