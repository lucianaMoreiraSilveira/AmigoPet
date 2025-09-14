function Authorize(roleAccess) {
  return (request, reply, nextStage) => {
    if (request.user.userRole != roleAccess)
      return reply.status(403).json({ error: "Access Denied" });

    nextStage();
  };
}

module.exports = Authorize;
