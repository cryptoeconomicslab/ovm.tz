#include "../types/index.ligo"

function is_decided(
  const adjudication_storage: adjudication_storage;
  const game_id: bytes;
) : challenge_game is
begin skip end with adjudication_storage.instantiated_games[game_id].decision == 1
