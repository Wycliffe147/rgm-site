export async function onRequestPost(context) {
  const { request, env } = context;
  const ai = env.AI;

  if (!ai) {
    return Response.json({
      response: "Hello! I am RGM's spiritual assistant. Currently, my AI brain is offline. Please reach out to our team directly on WhatsApp (+265 881 65 07 53) or call us (+265 997 17 38 15) for prayer and counseling support!"
    });
  }

  try {
    const { message, history } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message parameter is required' }, { status: 400 });
    }

    const systemPrompt = `You are the spiritual support assistant for Revealed Gospel Ministries (RGM), an evangelistic movement based in Mzuzu, Malawi.
Your role is to provide encouraging, scripture-grounded, and loving guidance on Christian faith, salvation, and moral support.
Keep your answers biblical, concise (1-3 paragraphs), and deeply compassionate.
Always guide users to connect with RGM's pastors or counselors directly if they need personal counseling, deliverance, or church follow-up:
- WhatsApp: +265 881 65 07 53
- Call: +265 997 17 38 15
If the user mentions needing prayer, remind them they can submit a prayer request on this page so our team can follow up and pray for them.

Special Site Info Rules:
1. If the user asks who made or built this website, you must clearly state that Wycliffe Mwanganda built it.
2. If the user asks who Rose is, you must speak of her with wonderful praises, describing her as a beautiful, brilliant, and blessed person, and refer to her as Wycliffe's girlfriend.`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Load conversation history (up to last 6 messages to stay within context size constraints)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-6);
      recentHistory.forEach(msg => {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role, content: msg.content.substring(0, 800) });
        }
      });
    }

    // Append latest user message
    messages.push({ role: 'user', content: message.substring(0, 800) });

    // Execute Cloudflare Worker AI model (using meta-llama 3.1 fast instruct)
    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct-fast', { messages });

    if (result && result.response) {
      return Response.json({ response: result.response });
    } else {
      throw new Error('Empty AI response');
    }

  } catch (err) {
    console.error('Chatbot API error:', err);
    return Response.json({
      response: "I'm having trouble connecting right now, but please know that God loves you! Feel free to contact our pastors on WhatsApp (+265 881 65 07 53) or call (+265 997 17 38 15)."
    });
  }
}
