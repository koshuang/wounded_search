angular.module('app')
  .factory('UserService', function($http) {
    var cache;
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http({
        url: 'https://raw.githubusercontent.com/tpe-doit/color-explosion-20150628/master/gistfile1.json',
        cache: true
      });
    }
  })
  .factory('menuService', [
    '$location',
    '$rootScope',
    function($location, $rootScope) {
      return {
        create: function(lastmodify) {
          var sections = [];

          //   社會局社工科電話 <a href="tel:02-27206528">02-27206528</a><br><br>
          //   <a target="_blank" href="https://tw.news.yahoo.com/%E5%B9%AB%E5%8A%A9%E5%85%AB%E4%BB%99%E5%82%B7%E8%80%85-%E4%BD%A0%E5%8F%AF%E4%BB%A5%E5%81%9A%E5%BE%97%E6%9B%B4%E5%A4%9A-034650399.html">幫助八仙傷者 你可以做得更多</a><br><br>
          //   <a href="http://er.mohw.g0v.tw/#/dashboard/file/default.json">全國重度級急救責任醫院急診即時訊息</a>
          //   <small>資料來源：<a ng-href="{{vm.source.url}}" target="_blank">{{vm.source.name}}</a></small>
          //   <small>最後更新時間：{{vm.lastmodify}}</small>
          sections.push({
            name: '資訊',
            type: 'toggle',
            pages: [{
              name: '社會局社工科電話',
              content: '02-27206528',
              icon: 'fa fa-group',
              type: 'content',
            }, {
              name: '最後更新時間',
              content: lastmodify,
              type: 'content',
            }]
          });

          var self;

          return self = {
            sections: sections,

            toggleSelectSection: function(section) {
              self.openedSection = (self.openedSection === section ?
                null :
                section);
            },
            isSectionSelected: function(section) {
              return self.openedSection === section;
            },

            selectPage: function(section, page) {
              page && page.url && $location.path(page.url);
              self.currentSection = section;
              self.currentPage = page;
            }
          };
        }
      }

      function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
          (a.humanName > b.humanName) ? 1 : 0;
      }

    }
  ]);
