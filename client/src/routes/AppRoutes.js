import LessonView from "../views/course/LessonView";

const Routes = [
  {
    path: "/course/:courseid/lesson/:lessonid",
    view: LessonView,
    layout: "app",
    title: "Lesson X",
    // permission: "user",
  },
];

export default Routes;
