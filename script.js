document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lessonPlanForm');
  const lessonContent = document.getElementById('lessonContent');
  const apiDataElement = document.getElementById('apiData');
  const assessmentSection = document.getElementById('assessmentSection');
  const assessmentContent = document.getElementById('assessmentContent');
  const assessmentDataElement = document.getElementById('assessmentData');
  const searchHistoryContainer = document.getElementById('searchHistoryContainer');
  const clearHistoryBtn = document.getElementById('clearHistory');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = document.getElementById('topic').value;
    const grade = document.getElementById('grade').value;
    const duration = document.getElementById('duration').value;
    const deliveryType = document.getElementById('deliveryType').value;
    
    const response = await fetch('fetchData.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, grade, duration, deliveryType })
    });

    if (!response.ok) {
      console.error('HTTP error:', response.status);
      apiDataElement.textContent = 'Error generating lesson plan. Please try again.';
      return;
    }

    const data = await response.json();
    apiDataElement.textContent = data.lessonPlan;
    lessonContent.classList.remove('hidden');
    assessmentSection.classList.remove('hidden');
    updateSearchHistory();
  });

  document.getElementById('generateAssessment').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const grade = document.getElementById('grade').value;

    const response = await fetch('generateAssessment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, grade })
    });

    if (!response.ok) {
      console.error('HTTP error:', response.status);
      assessmentDataElement.textContent = 'Error generating assessment. Please try again.';
      return;
    }

    const data = await response.json();
    assessmentDataElement.textContent = data.assessment;
    assessmentContent.classList.remove('hidden');
  });

  document.getElementById('downloadContentPdf').addEventListener('click', () => {
    const element = apiDataElement;
    html2pdf().from(element).save('LessonPlan.pdf');
  });

  document.getElementById('downloadAssessmentPdf').addEventListener('click', () => {
    const element = assessmentDataElement;
    html2pdf().from(element).save('Assessment.pdf');
  });

  document.getElementById('downloadPpt').addEventListener('click', () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText(apiDataElement.textContent, { x: 0.5, y: 0.5, w: '90%', h: '90%' });
    pptx.writeFile('LessonPlan.pptx');
  });

  document.getElementById('regenerateContent').addEventListener('click', async () => {
    form.dispatchEvent(new Event('submit'));
  });

  async function updateSearchHistory() {
    const response = await fetch('getHistory.php');
    const data = await response.json();
    searchHistoryContainer.innerHTML = data.history.map(entry => `
      <div class="p-2 mb-2 bg-gray-200 rounded-md">
        <p><strong>Topic:</strong> ${entry.topic}</p>
        <p><strong>Grade:</strong> ${entry.grade}</p>
        <p><strong>Duration:</strong> ${entry.duration} mins</p>
        <p><strong>Delivery Type:</strong> ${entry.deliveryType}</p>
      </div>
    `).join('');
    clearHistoryBtn.classList.toggle('hidden', data.history.length === 0);
  }

  clearHistoryBtn.addEventListener('click', async () => {
    await fetch('clearHistory.php', { method: 'POST' });
    updateSearchHistory();
  });

  updateSearchHistory();
});
