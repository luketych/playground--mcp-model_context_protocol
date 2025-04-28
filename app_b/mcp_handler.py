def parse_mcp_package(mcp_package):
    context = mcp_package["context"]
    prompt = (
        f"System Instruction: {context['system_message']}\n\n"
        "Memory:\n" + "\n".join(context.get("memory", [])) + "\n\n"
        "Conversation:\n" + "\n".join(
            f"{m['role'].capitalize()}: {m['content']}" for m in context.get("conversation", [])
        ) + "\n\n"
        f"Task: {context['current_task']}"
    )
    return prompt