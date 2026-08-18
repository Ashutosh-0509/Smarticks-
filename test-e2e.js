

async function testEndpoint() {
  const payload = {
    title: 'Voice reported complaint',
    description: 'Yeah hi um there is a huge tree branch that fell down right across Elm street blocking both lanes. It happened like ten minutes ago during the storm. People are having to drive up on the sidewalk to get around it.',
    image_url: '' // no image for this test
  };

  console.log("Sending payload from 'Frontend' to localhost:3001/api/analyze...");
  console.log("Payload:", payload);
  console.log("Notice: No API key is sent from the frontend!\n");

  try {
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Received response from Gemini via Backend:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testEndpoint();
