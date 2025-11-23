import { DonorOrganisation, DonorProject, Country } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllDonors = async (req, res, next) => {
  try {
    const donors = await DonorOrganisation.findAll({
      include: [{
        model: DonorProject,
        as: 'projects',
        attributes: ['id']
      }],
      order: [['name', 'ASC']]
    });

    const donorsWithCounts = donors.map(donor => ({
      ...donor.toJSON(),
      projectCount: donor.projects ? donor.projects.length : 0
    }));

    res.json(donorsWithCounts);
  } catch (error) {
    next(error);
  }
};

export const getDonorProjects = async (req, res, next) => {
  try {
    const { country, donor, status } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const include = [
      {
        model: DonorOrganisation,
        as: 'donorOrganisation',
        attributes: ['id', 'name', 'code', 'logoUrl'],
        ...(donor && { where: { code: donor } })
      },
      {
        model: Country,
        as: 'country',
        attributes: ['id', 'name', 'code'],
        required: false
      }
    ];

    const projects = await DonorProject.findAll({
      where,
      include,
      order: [['startDate', 'DESC']]
    });

    // Filter by country if specified
    let filteredProjects = projects;
    if (country) {
      filteredProjects = projects.filter(project => 
        project.country?.code === country || 
        project.isRegional === true
      );
    }

    res.json(filteredProjects);
  } catch (error) {
    next(error);
  }
};

export const getDonorProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await DonorProject.findByPk(id, {
      include: [
        {
          model: DonorOrganisation,
          as: 'donorOrganisation',
          attributes: ['id', 'name', 'code', 'logoUrl', 'website', 'contactEmail']
        },
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name', 'code'],
          required: false
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Donor project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getCountryDonorActivity = async (req, res, next) => {
  try {
    const { countryCode } = req.params;

    if (!countryCode) {
      return res.status(400).json({ error: 'Country code is required' });
    }

    const country = await Country.findOne({ 
      where: { code: countryCode },
      attributes: ['id', 'name', 'code']
    });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Get all projects for this country
    const projects = await DonorProject.findAll({
      where: {
        [Op.or]: [
          { countryId: country.id },
          { isRegional: true }
        ]
      },
      include: [
        {
          model: DonorOrganisation,
          as: 'donorOrganisation',
          attributes: ['id', 'name', 'code', 'logoUrl']
        }
      ],
      order: [['startDate', 'DESC']]
    });

    // Group by donor
    const donorActivity = {};
    let totalBudget = 0;

    projects.forEach(project => {
      const donor = project.donorOrganisation;
      if (!donorActivity[donor.id]) {
        donorActivity[donor.id] = {
          donor: donor,
          projects: [],
          totalBudget: 0,
          projectCount: 0
        };
      }
      
      donorActivity[donor.id].projects.push(project);
      donorActivity[donor.id].totalBudget += parseFloat(project.totalBudget || 0);
      donorActivity[donor.id].projectCount += 1;
      totalBudget += parseFloat(project.totalBudget || 0);
    });

    res.json({
      country,
      donors: Object.values(donorActivity),
      totalBudget,
      totalProjects: projects.length
    });
  } catch (error) {
    next(error);
  }
};
