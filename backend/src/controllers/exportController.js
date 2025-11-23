import { 
  Programme, Workstream, Assignment, ToR, Budget, 
  Indicator, Result, Evidence, Country, Consultant 
} from '../models/index.js';
import { format } from 'date-fns';

export const exportToJSON = async (req, res, next) => {
  try {
    const { entity, filters } = req.query;
    let data;

    switch (entity) {
      case 'assignments':
        data = await Assignment.findAll({
          where: filters ? JSON.parse(filters) : {},
          include: [
            { model: ToR, as: 'tor' },
            { model: Consultant, as: 'consultant' },
            { model: Workstream, as: 'workstream' },
            { model: Country, as: 'country' }
          ]
        });
        break;
      case 'budgets':
        data = await Budget.findAll({
          where: filters ? JSON.parse(filters) : {},
          include: [
            { model: Workstream, as: 'workstream' },
            { model: Programme, as: 'programme' }
          ]
        });
        break;
      case 'indicators':
        data = await Indicator.findAll({
          where: filters ? JSON.parse(filters) : {},
          include: [
            { model: Result, as: 'results' }
          ]
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const exportToCSV = async (req, res, next) => {
  try {
    const { entity } = req.query;
    let data;
    let csvContent;

    switch (entity) {
      case 'assignments':
        data = await Assignment.findAll({
          include: [
            { model: ToR, as: 'tor' },
            { model: Consultant, as: 'consultant' },
            { model: Workstream, as: 'workstream' }
          ]
        });

        csvContent = 'Reference,Title,Consultant,Workstream,Start Date,End Date,Status,LoE,Daily Rate,Total Value\n';
        data.forEach(a => {
          csvContent += `"${a.referenceNumber}","${a.title}","${a.consultant?.firstName} ${a.consultant?.lastName}","${a.workstream?.name}","${format(new Date(a.startDate), 'yyyy-MM-dd')}","${format(new Date(a.endDate), 'yyyy-MM-dd')}","${a.status}",${a.contractedLoE},${a.dailyRate},${a.totalValue}\n`;
        });
        break;

      case 'budgets':
        data = await Budget.findAll({
          include: [
            { model: Workstream, as: 'workstream' },
            { model: Programme, as: 'programme' }
          ]
        });

        csvContent = 'Code,Name,Programme,Workstream,Fiscal Year,Allocated,Committed,Actual Spend,Forecast,PBR Flagged\n';
        data.forEach(b => {
          csvContent += `"${b.code}","${b.name}","${b.programme?.name || ''}","${b.workstream?.name || ''}","${b.fiscalYear}",${b.allocatedAmount},${b.committedAmount},${b.actualSpend},${b.forecast},${b.isPBRFlagged}\n`;
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${entity}-${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const exportToDevTracker = async (req, res, next) => {
  try {
    const { programmeId } = req.query;

    const programme = await Programme.findByPk(programmeId, {
      include: [
        {
          model: Workstream,
          as: 'workstreams',
          include: [
            { model: Assignment, as: 'assignments' },
            { model: Budget, as: 'budgets' },
            { model: Indicator, as: 'indicators' }
          ]
        }
      ]
    });

    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    // DevTracker format
    const devTrackerData = {
      project: {
        iati_identifier: programme.code,
        title: programme.name,
        description: programme.description,
        start_date: format(new Date(programme.startDate), 'yyyy-MM-dd'),
        end_date: format(new Date(programme.endDate), 'yyyy-MM-dd'),
        status: programme.ragStatus,
        total_budget: programme.totalBudget
      },
      workstreams: programme.workstreams.map(ws => ({
        name: ws.name,
        pillar: ws.pillar,
        budget: ws.budget,
        assignments_count: ws.assignments?.length || 0,
        indicators_count: ws.indicators?.length || 0
      })),
      financial_summary: {
        total_budget: programme.totalBudget,
        total_committed: programme.workstreams.reduce((sum, ws) => 
          sum + ws.budgets.reduce((bSum, b) => bSum + parseFloat(b.committedAmount || 0), 0), 0
        ),
        total_spend: programme.workstreams.reduce((sum, ws) => 
          sum + ws.budgets.reduce((bSum, b) => bSum + parseFloat(b.actualSpend || 0), 0), 0
        )
      },
      results: {
        indicators_count: programme.workstreams.reduce((sum, ws) => sum + (ws.indicators?.length || 0), 0)
      }
    };

    res.json(devTrackerData);
  } catch (error) {
    next(error);
  }
};

export const exportARPack = async (req, res, next) => {
  try {
    const { programmeId, quarter, fiscalYear } = req.query;

    const programme = await Programme.findByPk(programmeId, {
      include: [
        {
          model: Workstream,
          as: 'workstreams',
          include: [
            { model: Assignment, as: 'assignments' },
            { model: Budget, as: 'budgets' },
            { model: Indicator, as: 'indicators', include: [{ model: Result, as: 'results' }] }
          ]
        }
      ]
    });

    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    const arPack = {
      programme: {
        name: programme.name,
        code: programme.code,
        status: programme.ragStatus
      },
      period: {
        quarter,
        fiscalYear
      },
      financial_summary: {
        budget: programme.totalBudget,
        spend_to_date: programme.workstreams.reduce((sum, ws) => 
          sum + ws.budgets.reduce((bSum, b) => bSum + parseFloat(b.actualSpend || 0), 0), 0
        ),
        forecast: programme.workstreams.reduce((sum, ws) => 
          sum + ws.budgets.reduce((bSum, b) => bSum + parseFloat(b.forecast || 0), 0), 0
        )
      },
      deliverables_summary: {
        total_assignments: programme.workstreams.reduce((sum, ws) => sum + (ws.assignments?.length || 0), 0),
        active_assignments: programme.workstreams.reduce((sum, ws) => 
          sum + (ws.assignments?.filter(a => a.status === 'Active').length || 0), 0
        )
      },
      results_summary: {
        total_indicators: programme.workstreams.reduce((sum, ws) => sum + (ws.indicators?.length || 0), 0),
        indicators_on_track: programme.workstreams.reduce((sum, ws) => 
          sum + (ws.indicators?.filter(i => (i.actual / i.target) >= 0.8).length || 0), 0
        )
      },
      generated_date: new Date().toISOString()
    };

    res.json(arPack);
  } catch (error) {
    next(error);
  }
};

