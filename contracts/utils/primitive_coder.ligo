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

function decode_range(const bytes: bytes) : range is
begin
  const unpacked_opt : option((nat * nat)) = bytes_unpack(bytes);
  const unpacked_range: range = record
    start_ = 0n;
    end_ = 0n;
  end;
  case unpacked_opt of
    | Some(r) -> unpacked_range := record
      start_ = r.0;
      end_ = r.1;
    end
    | None -> failwith("decode error")
  end;
end with unpacked_range

function encode_property(const property: property) : bytes is
begin skip end with bytes_pack((property.predicate_address, property.inputs));

function decode_property(const bytes: bytes) : property is
begin
  const unpacked_opt : option((address * map(nat, bytes))) = bytes_unpack(bytes);
  const unpacked_property: property = record
    predicate_address = source;
    inputs = (map end: map(nat, bytes));
  end;
  case unpacked_opt of
    | Some(p) -> unpacked_property := record
      predicate_address = p.0;
      inputs = p.1;
    end
    | None -> failwith("decode error")
  end;
end with unpacked_property

function pack_property (const action: property; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), encode_property(action))
