angular.module('app')
  .controller('StatusController', function(UserService, $timeout) {
    var vm = this;

    vm.options = {
      chart: {
        type: 'pieChart',
        x: function(d) {
          return d.key + ' (' + d.value + ')';
        },
        y: function(d) {
          return d.value;
        },
        valueFormat: function(d) {
          return d3.format('d')(d);
        },
        showLabels: true,
        showLegend: false,
        transitionDuration: 500,
        labelThreshold: 0.01
      }
    };

    var createChartData = R.mapObjIndexed(function(users, name) {
      return {
        name: name,
        users: users
      };
    });
    var groupByHospitalName = R.compose(R.groupBy, R.prop);

    activate();

    function activate() {
      UserService.getUsers()
        .then(setUsers)
        .then(hospitalStatistic)
        .then(injuryStatistic)
        .then(formalInjuryStatistic)
        .then(statusStatistic);

      $timeout(function() {
        // 一開始的寬度太小
        vm.options.chart.height = vm.options.chart.height || document.getElementsByTagName(
          'md-card-content')[0].clientWidth;
      }, 500);
    }

    function setUsers(response) {
      var data = response.data;
      vm.users = data.data;

      return vm.users;
    }

    function hospitalStatistic(users) {
      var getHospitals = R.compose(R.values, createChartData,
        groupByHospitalName('收治單位'));
      var hospitalUsers = getHospitals(users);

      vm.hospitals = R.map(function(hospital) {
        return {
          key: hospital.name,
          value: hospital.users.length
        };
      }, hospitalUsers);

      vm.hospitals = R.sortBy(R.prop('value'), vm.hospitals);

      return users;
    }

    function injuryStatistic(users) {
      var doit = R.compose(R.values, createChartData, groupByHospitalName(
        '救護檢傷'));

      vm.injuries = doit(users);

      vm.injuries = R.map(function(hospital) {
        return {
          key: hospital.name || '其他',
          value: hospital.users.length
        };
      }, vm.injuries);

      return users;
    }

    function formalInjuryStatistic(users) {
      var doit = R.compose(R.values, createChartData, groupByHospitalName(
        '醫療檢傷'));

      vm.formalInjuries = doit(users);

      vm.formalInjuries = R.map(function(hospital) {
        return {
          key: hospital.name || '其他',
          value: hospital.users.length
        };
      }, vm.formalInjuries);

      return users;
    }

    function statusStatistic(users) {
      var groupByHospitalName = R.groupBy(function(user) {
        var status = user['即時動向'];

        if (status.indexOf('自動出院') !== -1) {
          return '出院';
        }

        return status;
      });

      var doit = R.compose(R.values, createChartData, groupByHospitalName);

      vm.allStatus = doit(users);

      vm.allStatus = R.map(function(hospital) {
        return {
          key: hospital.name || '',
          value: hospital.users.length
        };
      }, vm.allStatus);

      return users;
    }

    function log(obj) {
      console.log(obj);
      return obj;
    }
  });
