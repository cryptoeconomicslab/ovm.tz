(**
 * return all storage
 *)
function get_storage_action (const params: int; const s: ovm_storage) : context is
  block {skip} with ((nil : list(operation)), s)
