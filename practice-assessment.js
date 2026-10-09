export function holdGrade(actual,target,speed=1){
 const tolerance=Math.max(.18*speed,target*.2);
 return Math.abs(actual-target)<=tolerance?'tepat':actual<target?'terlalu singkat':'terlalu lama';
}
export function velocityGrade(actual,target){return Math.abs(actual-target)<=20?'tepat':actual<target?'terlalu lembut':'terlalu keras';}
