angular.module('app')
  .controller('StatusController', function(UserService) {
    var vm = this;
    var getHospitals = getHospitalsFn();

    vm.options = {
      chart: {
        type: 'pieChart',
        height: 600,
        x: function(d) {
          return d.key + ' (' + d.value + ')';
        },
        y: function(d) {
          return d.value;
        },
        showLabels: true,
        showLegend: false,
        transitionDuration: 500,
        labelThreshold: 0.01
      }
    };

    activate();

    function activate() {
      UserService.getUsers()
        .then(setUsers)
        .then(hospitalStatistic)
        .then(injuryStatistic);
    }

    function setUsers(response) {
      var data = response.data;
      vm.users = data.data;
    }

    function hospitalStatistic() {
      var hospitalUsers = getHospitals(vm.users);

      vm.hospitals = R.map(function(h) {
        return {
          key: h.name,
          value: h.users.length
        };
      }, hospitalUsers);

      vm.hospitals = R.sortBy(R.prop('value'), vm.hospitals);
    }

    function injuryStatistic() {
      var groupByHospitalName = R.groupBy(function(u) {
        return u['救護檢傷'];
      });

      var createInjuries = R.mapObjIndexed(function(users, injury) {
        return {
          name: injury,
          users: users
        };
      });

      var doit = R.compose(R.values, createInjuries, groupByHospitalName);

      vm.injuries = doit(vm.users);

      vm.injuries = R.map(function(h) {
        return {
          key: h.name || '其他',
          value: h.users.length
        };
      }, vm.injuries);

      log(vm.injuries);
    }

    function getHospitalsFn() {
      var groupByHospitalName = R.groupBy(function(u) {
        return u['收治單位'];
      });

      var createHospitals = R.mapObjIndexed(function(users, hospital) {
        return {
          name: hospital,
          users: users
        };
      });

      return R.compose(R.values, createHospitals,
        groupByHospitalName);
    }

    function log(obj) {
      console.log(obj);
      return obj;
    }
  });
