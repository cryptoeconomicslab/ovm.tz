#include "../types/index.ligo"

function encode_address(const addr: address) : bytes is
begin skip end with bytes_pack(addr);

function decode_address(const bytes: bytes) : option(address) is
begin skip end with (bytes_unpack(bytes) : option(address));

function encode_number(const n: nat) : bytes is
begin skip end with bytes_pack(n);

function decode_number(const bytes: bytes) : option(nat) is
begin skip end with (bytes_unpack(bytes) : option(nat));

function encode_range(const range: range) : bytes is
begin skip end with bytes_pack((range.start_, range.end_));

function decode_range(const bytes: bytes) : option(range) is
begin
  const r_opt : option((nat * nat)) = bytes_unpack(bytes);
end with case r_opt of
  | Some(p) -> Some(record
    start_ = p.0;
    end_ = p.1;
  end)
  | None -> (None : option(range))
end

function encode_property(const property: property) : bytes is
begin skip end with bytes_pack((property.predicate_address, property.inputs));

function decode_property(const bytes: bytes) : option(property) is
begin
  const p_opt : option((address * list(bytes))) = bytes_unpack(bytes);
end with case p_opt of
  | Some(p) -> Some(record
    predicate_address = p.0;
    inputs = p.1;
  end)
  | None -> (None : option(property))
end
