// No UI. Import this module from the future static trainer.
export function questionKey(scenario,question){return `${scenario.id}/${question.id}`;}
export function lessonTag(scenario,question,lessons){return question.lesson_tag??lessons.reference_question_tags?.[scenario.id]?.[question.id]??null;}
export function evaluate(scenario,answers,lessons){
  if(answers.length>scenario.questions.length)throw new Error('Too many answers');
  let points=0;const review=new Map();
  answers.forEach((selected,i)=>{
    if(!Number.isInteger(selected)||selected<0||selected>2)throw new Error('Answer must be 0, 1 or 2');
    const q=scenario.questions[i];
    if(selected===q.correct_index)points++;
    else {const tag=lessonTag(scenario,q,lessons);const entry=review.get(tag)||{tag,lesson:lessons.lessons.find(l=>l.tag===tag)??null,mistakes:0,question_ids:[]};entry.mistakes++;entry.question_ids.push(questionKey(scenario,q));review.set(tag,entry);}
  });
  return {answered:answers.length,total:scenario.questions.length,progress_percent:answers.length/scenario.questions.length*100,points,max_points:scenario.questions.length,complete:answers.length===scenario.questions.length,score_percent:answers.length===scenario.questions.length?Math.round(points/scenario.questions.length*100):null,review:[...review.values()]};
}
export function feedbackFor(scenario,questionIndex,selected,lessons){
  if(!Number.isInteger(questionIndex)||questionIndex<0||questionIndex>=scenario.questions.length)throw new Error('Invalid question index');
  if(!Number.isInteger(selected)||selected<0||selected>2)throw new Error('Invalid answer index');
  const q=scenario.questions[questionIndex],correct=selected===q.correct_index;
  const tag=lessonTag(scenario,q,lessons);
  return {correct,selected_feedback:q.options[selected].feedback,ideal_response:q.options[q.correct_index].text,ideal_feedback:q.options[q.correct_index].feedback,recommended_lesson:correct?null:lessons.lessons.find(l=>l.tag===tag)??null};
}
