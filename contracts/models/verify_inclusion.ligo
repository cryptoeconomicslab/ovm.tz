#include "../types/index.ligo"

type address_tree_node is record
  data: bytes;
  address: address;
end

// TODO: interval_tree_node is encoded by original encoder
type interval_tree_node is record
  data: bytes;
  start: nat;
end

type address_inclusion_proof is record
  leaf_index: address;
  leaf_position: nat;
  siblings: map(nat, address_tree_node)
end

type interval_inclusion_proof is record
  leaf_index: nat;
  leaf_position: nat;
  siblings: map(nat, interval_tree_node)
end

type inclusion_proof is record
  address_inclusion_proof: address_inclusion_proof;
  interval_inclusion_proof: interval_inclusion_proof;
end

function get_parent(
  const left: bytes;
  const left_start: nat;
  const right: bytes;
  const right_start: nat
) : bytes is
begin
  if right_start >= left_start
  then skip
  else failwith("left_start must be less than right_start");
end with sha_256(bytes_concat(bytes_concat(bytes_concat(left, bytes_pack(left_start)), right), bytes_pack(right_start)));

function compute_interval_tree_root(
  var computed_root: bytes;
  var computed_start: nat;
  const merkle_path: nat;
  const proof: map(nat, interval_tree_node)
) : (bytes * nat) is
begin
  var first_right_sibling_start: nat := 99999n;
  var is_first_right_set: bool := False;
  var tmp_merkle_path: nat := merkle_path;
  for i := 1 to int(size(proof))
    begin
      const a_proof : interval_tree_node = get_force(abs(i - 1), proof);
      const sibling: bytes = a_proof.data;
      const sibling_start: nat = a_proof.start;
      const is_right: nat = tmp_merkle_path mod 2n;
      tmp_merkle_path := tmp_merkle_path / 2n;
      if is_right = 1n
      then computed_root := get_parent(sibling, sibling_start, computed_root, computed_start)
      else
      begin
        if not is_first_right_set
        then begin
          first_right_sibling_start := sibling_start;
          is_first_right_set := True;
        end else skip;
        if first_right_sibling_start <= sibling_start
        then skip
        else failwith("first_right_sibling_start must be greater than sibling_start");
        computed_root := get_parent(computed_root, computed_start, sibling, sibling_start);
        computed_start := sibling_start;
      end;
    end
end with (computed_root, first_right_sibling_start);

function verify_inclusion(
  const leaf: bytes;
  const token_address: address;
  const range: range;
  const inclusion_proof: inclusion_proof;
  const root: bytes
) : bool is
begin
  const root_and_implicit_end: (bytes * nat) = compute_interval_tree_root(
      leaf,
      inclusion_proof.interval_inclusion_proof.leaf_index,
      inclusion_proof.interval_inclusion_proof.leaf_position,
      inclusion_proof.interval_inclusion_proof.siblings
  );
  if range.start_ >= inclusion_proof.interval_inclusion_proof.leaf_index and range.end_ <= root_and_implicit_end.1
  then skip
  else failwith("required range must not exceed the implicit range");
  // TODO: skip address tree verification in tezos
end with root_and_implicit_end.0 = root;
