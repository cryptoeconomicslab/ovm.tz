type token_type is address

type range is record
  start_: nat;
  end_: nat;
end

// Property
type property is record
  predicate_address: address;
  inputs: map(nat, bytes);
end

type state_update is record
  property: property;
  range: range;
  plasma_block_number: nat;
  deposit_address: address;
end

type checkpoint is record
  subrange: range;
  state_update: property;
end

type exit is checkpoint;

type challenge_game is record
  property: property;
  challenges: list(bytes);
  decision: nat;
  created_block: nat;
end
