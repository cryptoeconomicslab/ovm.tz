(**
 * return all storage
 *)
function get_storage_action (const s: ovm_storage; const params: int) : context is
  block {skip} with ((nil : list(operation)), s)
