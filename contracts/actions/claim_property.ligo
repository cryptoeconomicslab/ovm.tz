#include "../types/index.ligo"

type claim_property_params is record
  claim: property;
end

function get_property_id (const property: property) : bytes is
begin
  skip;
end with sha_256(bytes_pack(property));

function store_game(
  const adjudication_storage : adjudication_storage;
  const id: bytes;
  const property: property
) : adjudication_storage is
begin
  adjudication_storage.instantiated_games[id] := record
    property = property;
    challenges = (list end : list(bytes));
    decision = 0n;
    created_block = now;
  end;
end with adjudication_storage;

function claim_property_action(
  const claim_property_params: claim_property_params;
  const s: ovm_storage
) : context is
begin
  const game_id: bytes = get_property_id(claim_property_params.claim);
  s.adjudication_storage := store_game(s.adjudication_storage, game_id, claim_property_params.claim);
  // NewPropertyClaimed
  const new_property_claimed_event: event_params = list
    bytes_pack(game_id);
    bytes_pack(claim_property_params.claim);
    bytes_pack(now);
  end;
  s.events_storage := emit_event(s.events_storage, "NewPropertyClaimed", new_property_claimed_event);
end with ((nil : ops), s)
