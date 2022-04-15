import $ from 'jquery';
import {
  getSemesterType,
  isFallSemester,
  isSpringSemester,
  convertSemToTermCode,
} from './utils/SemesterUtils';

// TODO: refactor from here and SearchCard.js
const BASE_COURSE_OFFERINGS_URL = 'https://www.princetoncourses.com/course/';

export function addPopover(course, courseKey, semIndex) {
  let courseName = course['name'];
  let courseTitle = course['title'];
  let courseSemType = course['semester'];

  let courseElement = $(`#${courseKey}`);
  courseElement.attr('title', courseName);
  courseElement.attr('data-html', 'true');

  // Add content to the popover
  let content;
  if (!course['external']) {
    content = courseTitle;
  } else {
    content = "This is an external credit that you've added.";
  }
  let addedCoursesWithSameName = $('.semester').find(`[title="${courseName}"]`);

  if (addedCoursesWithSameName.length > 1) {
    content +=
      "<div class='popover-warning'>This course has already been added to your schedule.</div>";
  }

  if (courseSemType === 'fall' && isSpringSemester(getSemesterType(semIndex))) {
    content +=
      "<div class='popover-warning'>This course has previously only been offered in the Fall.</div>";
  } else if (
    courseSemType === 'spring' &&
    isFallSemester(getSemesterType(semIndex))
  ) {
    content +=
      "<div class='popover-warning'>This course has previously only been offered in the Spring.</div>";
  }

  let courseId = course['id'];
  // TODO: Don't hardcode the semester list
  let courseSemList = course['semester_list'];
  if (courseSemList && courseSemList.length > 0) {
    let termCode = convertSemToTermCode(
      courseSemList[courseSemList.length - 1]
    );
    let courseInfoLink = BASE_COURSE_OFFERINGS_URL + termCode + courseId;

    content += "<div className='search-card-links'>";
    content +=
      '<a href=' +
      courseInfoLink +
      " target='_blank' rel='noopener noreferrer'> ";
    content += "<i class='fas fa-info-circle fa-lg fa-fw course-info'></i>";
    content += '</a> ';
    content += '</div>';
  }

  courseElement.attr('data-content', content);

  // Show the popover when it's hovered over
  courseElement
    .popover({
      trigger: 'manual',
      html: true,
      animation: true,
      sanitize: false,
    })
    .on('mouseenter', () => {
      courseElement.popover('show');
      $('.popover').on('mouseleave', () => {
        courseElement.popover('hide');
      });
    })
    .on('mouseleave', () => {
      setTimeout(() => {
        if (!$('.popover:hover').length) {
          courseElement.popover('hide');
        }
      }, 100);
    });
}
