exports.getEmployeeSupervisor = (req, res, next) => {
    const empId = req.params.id;
    const supervisors = [];
    Supervisor.find()
      .populate('supervisor.supervisor_id', 'empFirstName')
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          for (i in result) {
            if (result[i].employee.toString() === empId.toString()) {
              for (j in result[i].supervisor) {
                supervisors.push({
                  supervisor: result[i].supervisor[j].supervisor_id.empFirstName,
                  supervisor_id: result[i].supervisor[j].supervisor_id._id,
                  date: moment(result[i].supervisor[j].date).format("DD-MM-YYYY")
                })
              }
            }
          }
          res.status(200).send(supervisors);
        }
      });
  };