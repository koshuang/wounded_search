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
    }

    function hospitalStatistic() {
      var getHospitals = R.compose(R.values, createChartData,
        groupByHospitalName('收治單位'));
      var hospitalUsers = getHospitals(vm.users);

      vm.hospitals = R.map(function(hospital) {
        return {
          key: hospital.name,
          value: hospital.users.length
        };
      }, hospitalUsers);

      vm.hospitals = R.sortBy(R.prop('value'), vm.hospitals);
    }

    function injuryStatistic() {
      var doit = R.compose(R.values, createChartData, groupByHospitalName(
        '救護檢傷'));

      vm.injuries = doit(vm.users);

      vm.injuries = R.map(function(hospital) {
        return {
          key: hospital.name || '其他',
          value: hospital.users.length
        };
      }, vm.injuries);
    }

    function formalInjuryStatistic() {
      var doit = R.compose(R.values, createChartData, groupByHospitalName(
        '醫療檢傷'));

      vm.formalInjuries = doit(vm.users);

      vm.formalInjuries = R.map(function(hospital) {
        return {
          key: hospital.name || '其他',
          value: hospital.users.length
        };
      }, vm.formalInjuries);
    }

    function statusStatistic() {
      var groupByHospitalName = R.groupBy(function(user) {
        var status = user['即時動向'];

        if (status.indexOf('自動出院') !== -1) {
          return '出院';
        }

        return status;
      });

      var doit = R.compose(R.values, createChartData, groupByHospitalName);

      vm.allStatus = doit(vm.users);

      vm.allStatus = R.map(function(hospital) {
        return {
          key: hospital.name || '',
          value: hospital.users.length
        };
      }, vm.allStatus);
    }

    function log(obj) {
      console.log(obj);
      return obj;
    }
  });
