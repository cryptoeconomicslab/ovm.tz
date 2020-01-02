type checkpoint_id is bytes
type claim_id is string
type checkpoints is map(checkpoint_id, checkpoint)
type claims is map(claim_id, claim)
type commitments is map(nat, string)
