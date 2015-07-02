angular.module('app')
  .controller('HospitalStatisticsController', function(UserService) {
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
        .then(statistic);
    }

    function setUsers(response) {
      var data = response.data;
      vm.users = data.data;
    }

    function statistic() {
      var hospitalUsers = getHospitals(vm.users);

      vm.hospitals = R.map(function(h) {
        return {
          key: h.name,
          value: h.users.length
        };
      }, hospitalUsers);

      vm.hospitals = R.sortBy(R.prop('value'), vm.hospitals);

      console.log(hospitalUsers, vm.hospitals);
    }

    function getHospitalsFn() {
      var groupByHospitalName = R.groupBy(function(u) {
        return u['收治單位'];
      });

      var log = function(obj) {
        console.log(obj);
        return obj;
      };

      var createHospitals = R.mapObjIndexed(function(users, hospital) {
        return {
          name: hospital,
          users: users
        };
      });

      return R.compose(R.values, createHospitals, log,
        groupByHospitalName);
    }

    function toData(xProp, yProp) {
      return R.map(function(obj) {
        return {
          x: obj[xProp],
          y: obj[yProp]
        };
      });
    }

  });
