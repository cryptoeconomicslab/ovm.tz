type event is record
  block_height: int;
  data: string;
end

type block_event is map(string, list(event));
type events is map(int, block_event);
