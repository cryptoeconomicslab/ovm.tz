type range is record
  start_: nat;
  end_: nat;
end
type property is record
  predicate_address: address;
  input: string;
end

type state_update is record
  property: property;
  range: range;
  plasma_block_number: nat;
  deposit_address: address;
end
type checkpoint is record
  subrange: range;
  state_update: state_update;
end
type checkpoint_status is record
  challengeable_until: nat;
  outstanding_challenges: nat;
end
type claim is record
  property: property;
  num_proven_contradictions: nat;
  decided_after: nat;
end

type contradiction is record
  property: property;
  counter_property: property;
end
type implication_proof_element is record
  implication: property;
  witness: string;
end
type challenge is record
  challenged_checkpoint: checkpoint;
  challenging_checkpoint: checkpoint;
end